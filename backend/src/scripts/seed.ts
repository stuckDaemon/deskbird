import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../services/users/user.service';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { CreateUserInput } from '../services/users/user.interfaces';

const CHUNK_SIZE = 25;

async function seed(filePath: string) {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UserService);

  const file = fs.readFileSync(filePath, 'utf-8');
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CreateUserInput[];

  const failedEmails: string[] = [];

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);

    await Promise.all(
      chunk.map(async (record) => {
        const { email, password, role, firstName, lastName, age } = record;

        if (!email || !password || !firstName || !lastName || !age || !role) {
          console.log(`Skipping incomplete user record: ${JSON.stringify(record)}`);
          failedEmails.push(email ?? 'unknown');
          return;
        }

        try {
          await usersService.create({
            email,
            password,
            role,
            firstName,
            lastName,
            age: Number(age),
          });
          console.log(`Seeded user: ${email}`);
        } catch (err: any) {
          console.log(`Failed to seed user: ${email} (${err.message})`);
          failedEmails.push(email);
        }
      }),
    );

    console.log(`Processed chunk ${Math.floor(i / CHUNK_SIZE) + 1}`);
  }

  if (failedEmails.length > 0) {
    console.log(`Skipped ${failedEmails.length} users due to issues:`);
    console.log(failedEmails.join(', '));
  }

  await app.close();
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: yarn seed <path-to-csv>');
  process.exit(1);
}

seed(filePath);
